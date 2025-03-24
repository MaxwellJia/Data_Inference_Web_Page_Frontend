import React, { useState } from 'react';
import axios from 'axios';
import './DataTypeModify.css'; // Importing the associated CSS for styling
import './global.js';

function EditMapData() {
    // State variables
    const [file, setFile] = useState(null); // Stores the uploaded file
    const [dtypes, setDtypes] = useState([]); // Stores the list of column names and their data types
    const [isEdited, setIsEdited] = useState(false); // Tracks if the data has been edited
    const [loading, setLoading] = useState(false); // Tracks the loading state

    // Handles file input change and updates the 'file' state
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handles the file upload and fetches the initial column data types from the backend
    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file before uploading.');
            return;
        }
        setLoading(true); // Set loading state to true during upload
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Make POST request to backend to process the file
            const response = await axios.post(TARGET_BACKEND_LINK +'/api/types/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Transform response data into a list of key-value pairs for editing
            setDtypes(Object.entries(response.data).map(([key, value]) => ({ key, value })));
            setIsEdited(false); // Reset edit state
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('File upload failed.');
        }
        setLoading(false); // Reset loading state
    };

    // Handles changes to column names (keys)
    const handleKeyChange = (index, newKey) => {
        const updatedDtypes = [...dtypes];
        updatedDtypes[index].key = newKey; // Update the key value
        setDtypes(updatedDtypes);
        setIsEdited(true); // Mark the data as edited
    };

    // Handles changes to data types (values)
    const handleValueChange = (index, newValue) => {
        const updatedDtypes = [...dtypes];
        updatedDtypes[index].value = newValue; // Update the value
        setDtypes(updatedDtypes);
        setIsEdited(true); // Mark the data as edited
    };

    // Saves the edited data and triggers a download of the updated CSV
    const handleSave = async () => {
        setLoading(true); // Set loading state
        // Convert the data into a map format suitable for backend processing
        const updatedMap = dtypes.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        const formData = new FormData();
        formData.append('data', JSON.stringify(updatedMap));

        try {
            // Make POST request to save the updated data and retrieve the modified file
            const response = await axios.post(TARGET_BACKEND_LINK +'/api/save-types/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob', // Expect binary file as response
            });

            // Create a downloadable link for the response CSV file
            const blob = new Blob([response.data], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'output.csv'; // Set download file name
            link.click();
            setIsEdited(false); // Reset edit state
        } catch (error) {
            console.error('Error downloading the CSV:', error);
            alert('Error saving or downloading the file.');
        }
        setLoading(false); // Reset loading state
    };

    return (
        <div>
            {/* File input field */}
            <input type="file" onChange={handleFileChange} />

            {/* Upload button */}
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>

            {/* Display the data type editing table if data is available */}
            {dtypes.length > 0 && (
                <div>
                    <table border="1">
                        <thead>
                        <tr>
                            <th>Column Name</th>
                            <th>Data Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dtypes.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {/* Input field for column name */}
                                    <input
                                        type="text"
                                        value={item.key}
                                        onChange={(e) => handleKeyChange(index, e.target.value)}
                                    />
                                </td>
                                <td>
                                    {/* Dropdown for selecting data type */}
                                    <select
                                        value={item.value}
                                        onChange={(e) => handleValueChange(index, e.target.value)}
                                    >
                                        <option value="Text">Text</option>
                                        <option value="Integer64">Integer64</option>
                                        <option value="Integer32">Integer32</option>
                                        <option value="Integer16">Integer16</option>
                                        <option value="Integer8">Integer8</option>
                                        <option value="Decimal64">Decimal64</option>
                                        <option value="Decimal32">Decimal32</option>
                                        <option value="Date">Date</option>
                                        <option value="Datetime(UTC)">Datetime(UTC)</option>
                                        <option value="Boolean">Boolean</option>
                                        <option value="Category">Category</option>
                                        <option value="Time Interval">Time Interval</option>
                                        <option value="Complex Number">Complex Number</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {/* Save and download button */}
                    <button onClick={handleSave} disabled={loading || dtypes.length <= 0}>
                        {loading ? 'Processing...' : 'Save Changes and Download'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default EditMapData;

