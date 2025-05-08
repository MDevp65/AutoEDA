from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO
from starlette.responses import HTMLResponse, FileResponse
import tempfile
import os
from urllib.parse import quote_plus
from ydata_profiling import ProfileReport

app = FastAPI()

# Configure CORS to allow requests from your React app's origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Or the actual origin of your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_analysis_report(csv_content: str, filename: str) -> str:
    """
    Generates an HTML analysis report from CSV data using pandas-profiling.

    Args:
        csv_content: The string content of the CSV file.

    Returns:
        The path to the generated HTML file.

    Raises:
        Exception: If there's an error during the profiling process.
    """
    try:
        df = pd.read_csv(StringIO(csv_content))
        # Generate the profiling report.
        profile = ProfileReport(df,
            title=filename.removesuffix('.csv').capitalize(),
            progress_bar=False
        )
        # Save the report to a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".html")
        profile.to_file(temp_file.name)
        return temp_file.name  # Return the file path
    except Exception as e:
        raise Exception(f"Error generating analysis report: {e}")

@app.post("/analyze")
async def analyze_csv(request: Request, file: UploadFile = File(...)):
    """
    Endpoint to receive a CSV file, analyze it with pandas-profiling, and return a link to download the HTML report.

    Args:
        request: The request object.
        file: The uploaded CSV file.

    Returns:
        A JSON response containing the download link, or a JSON response with an error.
    """
    # Check if the file is a CSV file
    if not file.filename.lower().endswith((".csv")):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV file.")

    # Read the file content
    try:
        csv_content = await file.read()  # Read the entire file content as bytes
        csv_content_str = csv_content.decode("utf-8")  # Decode bytes to string
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {e}")

    # Generate the analysis report and get the file path
    try:
        report_file_path = generate_analysis_report(csv_content_str, file.filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  # Use the string from the exception

    #  Create a download link.
    #  The filename needs to be URL encoded in the content-disposition header.
    filename = os.path.basename(report_file_path)
    encoded_filename = quote_plus(filename)
    headers = {
        "Content-Disposition": f"attachment; filename={encoded_filename}"
    }
    return FileResponse(report_file_path, headers=headers) # Return the file directly

