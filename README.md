# Roblox Group Security

## Description

This Node.js script automates the deletion of posts in a Roblox group based on specified keywords. It fetches posts from the group wall, checks for keywords in the post content, and deletes posts that match the criteria. It generates an HTML report detailing which posts were deleted and which were safe.

## Features

- Fetches group posts from Roblox API.
- Deletes posts containing specified keywords.
- Generates an HTML report with detailed information on deleted and safe posts.
- Opens the generated HTML report in the default browser.
- Allows for re-runs with a timer.
- Reports are optional but give insight on what is being deleted.

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
  RUN_INTERVAL_MINUTES=1 - for example
  AUTO_RERUN_ENABLED=true or false
  GENERATE_HTML_REPORT=true or false
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

## You can view a live example of the generated report [here](https://statify.vmgware.dev/api/public/report.html).

The report provides a comprehensive overview of the activity related to Roblox group security. It details posts that were deleted based on specified keywords and includes information on posts that were considered safe. This can be invaluable for understanding the impact of automated moderation processes on your group's content.

### Insights from the Example Report

- **Deleted Posts:** Lists posts that matched the deletion criteria specified by the keywords.
- **Safe Posts:** Includes posts that did not meet the deletion criteria and were left untouched.
- **Timestamps:** Each entry in the report includes timestamps to track when posts were processed.

### How to Interpret the Report

The report serves as a log of actions taken by the Node.js script, offering transparency into the moderation activities performed on your Roblox group. It helps in maintaining community guidelines and ensuring content alignment with group standards.

### Usage Recommendations

- **Regular Review:** Periodically review the report to ensure the script is functioning correctly and that the deletion criteria are aligned with current community standards.
- **Adjustment of Keywords:** Modify the `KEYWORDS` environment variable in the `.env` file to refine the script's criteria for post deletion based on evolving content trends.

### Conclusion

By leveraging automated moderation through this Node.js script and utilizing the generated HTML report, you can effectively manage content within your Roblox group, promoting a safe and engaging environment for all members.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
