# Website Info

Website Info is a Chrome extension that displays detailed information about the current website, including its IP address, region, ISP, and more.

## Features

- Displays website information (IP, region, ISP, etc.) on the page.
- Provides a popup with local IP information.

## Installation

You can install the extension using one of the following methods:

### Method 1: Load Unpacked Project

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top-right corner.
4. Click "Load unpacked" and select the folder containing this project.

### Method 2: Install CRX File

1. Go to the [Releases](https://github.com/imcsd/Website-Info/releases) page of this repository.
2. Download the latest `.crx` file.
3. Drag and drop the `.crx` file into the Chrome extensions page (`chrome://extensions/`).
4. Since this extension is not published on the Chrome Web Store, you need to manually add the extension ID (`epmbdpcfhcpaiphcinkmkioacjmmgmdi`) to the registry ExtensionInstallAllowlist:

   - Open the Command Prompt as an administrator.
   - Run the following command to add the extension ID to the registry:

     ```cmd
     reg add "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallAllowlist" /v 10110 /t REG_SZ /d epmbdpcfhcpaiphcinkmkioacjmmgmdi /f
     ```

5. Restart Chrome and follow the prompts to complete the installation.
