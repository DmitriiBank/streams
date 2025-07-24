
import {compareFiles} from "./utils/tools.js";

const App = ()=> {
    const args = process.argv.slice(2);

    let filePath1 = '';
    let filePath2= '';

    if (args.length >= 2) {
        filePath1 = args[0];
        filePath2 = args[1];
    } else {
        filePath1 = './images/image.jpg';
        filePath2 = './images/image2.png';
        console.log('Using default file paths. You can specify paths as command line arguments:' +
            'npm start ./images/photo1.jpg ./images/photo2.jpg');
    }

    console.log(`Comparing files: ${filePath1} and ${filePath2}`);
    compareFiles(filePath1, filePath2);
}


App();