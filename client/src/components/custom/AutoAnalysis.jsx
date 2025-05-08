import { useState, useCallback } from 'react';
import CSVUpload from './CSVUpload'

const AutoAnalysis = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [downloaded, setDownloaded] = useState(false); // New state to track download status

    const handleFileChange = (file) => {
        setSelectedFile(file);
        setError(null);
        setDownloaded(false); // Reset download status when a new file is selected
    };

    const handleAnalyze = useCallback(async () => {
        if (!selectedFile) {
            setError('Please upload a CSV file.');
            return;
        }

        setLoading(true);
        setError(null);
        setAnalysisResult(null);
        setDownloaded(false); // Reset download status before analysis

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to analyze file');
            }

            const data = await response.text();
            setAnalysisResult(data);

        } catch (err) {
            setError(err.message || 'An error occurred during analysis.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedFile]);

    const downloadReport = () => {
        if (analysisResult) {
            const blob = new Blob([analysisResult], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'analysis_report.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setDownloaded(true);
            setSelectedFile(null);
            setAnalysisResult(null);
        }
    };

    return (
        <div className=" bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    CSV Data Analyzer
                </h1>

                <CSVUpload
                    onFileChange={handleFileChange}
                    errorMessage={error}
                    clearError={() => setError(null)}
                />

                <div className="flex justify-center">
                    <button // Changed to a standard button
                        onClick={handleAnalyze}
                        disabled={loading || !selectedFile || downloaded}
                        className={`
                            bg-gradient-to-r cursor-pointer from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full
                            hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg
                            ${(loading || !selectedFile || downloaded) && 'opacity-50 cursor-not-allowed'}
                        `}
                    >
                        {loading ? 'Analyzing...' : 'Analyze Data'}
                    </button>
                </div>

                {analysisResult && (
                    <div className="text-center">
                        <button  // Changed to a standard button
                            onClick={downloadReport}
                            className="bg-green-500 cursor-pointer text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
                        >
                            Download Report
                        </button>
                    </div>
                )}
                {downloaded && <p className='text-center text-green-400'>Report Downloaded Successfully!</p>}
            </div>
        </div>
    );
};

export default AutoAnalysis;