import fs from "fs";

export const compareFiles = async (filePath1: string, filePath2: string): Promise<void> => {
    try {
        if (!fs.existsSync(filePath1)) {
            throw new Error(`File not found: ${filePath1}`);
        }
        if (!fs.existsSync(filePath2)) {
            throw new Error(`File not found: ${filePath2}`);
        }

        const stream1 = fs.createReadStream(filePath1,
            {
                highWaterMark: 1024
            })

        const stream2 = fs.createReadStream(filePath2,
            {
                highWaterMark: 1024
            })

        let chunk1: Buffer | null;
        let chunk2: Buffer | null;
        let stream1Ended = false;
        let stream2Ended = false;
        let filesAreIdentical = true;

        const compareChunks = () => {
            while (chunk1 && chunk2) {
                if (!chunk1.equals(chunk2)) {
                    filesAreIdentical = false;
                    console.log('The files are not identical.');
                    stream1.destroy();
                    stream2.destroy();
                    return;
                }

                chunk1 = stream1.read();
                chunk2 = stream2.read();
            }
            if (stream1Ended && stream2Ended && chunk1 === null && chunk2 === null) {
                if (filesAreIdentical) {
                    console.log('The files are identical.');
                }
            }
        }

        stream1.on('readable', () => {
            if (!chunk1) {
                chunk1 = stream1.read();
                compareChunks();
            }
        });

        stream1.on('end', () => {
            stream1Ended = true;
            compareChunks();
        });

        stream2.on('readable', () => {
            if (!chunk2) {
                chunk2 = stream2.read();
                compareChunks();
            }
        });

        stream2.on('end', () => {
            stream2Ended = true;
            compareChunks();
        });
        stream1.on('error', (err) => {
            console.error(`Error reading ${filePath1}:`, err.message);
        });

        stream2.on('error', (err) => {
            console.error(`Error reading ${filePath2}:`, err.message);
        });

    } catch (error) {
        console.error('Error:', (error as Error).message);
    }
}