# Roblox Group Security

## Description

This Node.js script automates the deletion of posts in a Roblox group based on specified keywords. It fetches posts from the group wall, checks for keywords in the post content, and deletes posts that match the criteria. It generates an HTML report detailing which posts were deleted and which were safe.

## Features

- Fetches group posts from Roblox API.
- Deletes posts containing specified keywords.
- Generates an HTML report with detailed information on deleted and safe posts.
- Opens the generated HTML report in the default browser.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tyler-Github/RobloxGroupSecurity.git
cd RobloxGroupSecurity
```

2. Install dependencies:

```bash
npm install
```


3. Set up environment variables:
- Create a `.env` file in the root directory.
- Add the following environment variables:
  ```
  KEYWORDS=keyword1,keyword2,keyword3
  GROUP_ID=your-group-id
  ROBLOX_TOKEN=your-roblox-token
  ```

## Usage

Run the script using Node.js:

```bash
node index.js
```


The script will start fetching posts from the specified Roblox group, check for keywords, delete posts that match the criteria, and generate an HTML report (`report.html`). The report will automatically open in your default browser once generated.

## Notes

- Ensure your Roblox token (`ROBLOX_TOKEN`) has appropriate permissions to delete posts in the specified group.
- Adjust the delay (`delay` function) in `index.js` to avoid rate limits based on Roblox API usage policies.
- The HTML report (`report.html`) includes both deleted posts and safe posts that did not meet deletion criteria.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
