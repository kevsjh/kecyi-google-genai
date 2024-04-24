export const getMimeType = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = () => {
            const arrayBuffer = fileReader.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);

            // Check the magic number or signature to determine the MIME type
            if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
                // JPEG
                resolve('image/jpeg');
            } else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
                // PNG
                resolve('image/png');
            } else if (uint8Array[0] === 0x49 && uint8Array[1] === 0x49 && uint8Array[2] === 0x2A && uint8Array[3] === 0x00) {
                // TIFF
                resolve('image/tiff');
            } else if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49 && uint8Array[2] === 0x46) {
                // GIF
                resolve('image/gif');
            } else if (uint8Array[4] === 0x66 && uint8Array[5] === 0x74 && uint8Array[6] === 0x79 && uint8Array[7] === 0x70) {
                // HEIC
                resolve('image/heic');
            } else {
                // Unknown MIME type
                resolve('application/octet-stream');
            }
        };

        fileReader.onerror = () => {
            reject(new Error('Failed to read the file.'));
        };

        fileReader.readAsArrayBuffer(file);
    });
};