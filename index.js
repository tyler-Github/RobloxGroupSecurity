require('dotenv').config();
const fs = require('fs/promises');
const axios = require('axios');
const { exec } = require('child_process');
const { initializeNoblox, getCSRFToken } = require('./auth');

const keywords = process.env.KEYWORDS ? process.env.KEYWORDS.split(',') : [];
const groupId = process.env.GROUP_ID;
const robloxToken = process.env.ROBLOX_TOKEN;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const deletePost = async (postId, authToken) => {
    try {
        await axios.delete(`https://groups.roblox.com/v1/groups/${groupId}/wall/posts/${postId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `.ROBLOSECURITY=${robloxToken}`,
                'x-csrf-token': authToken
            }
        });
        console.log(`\x1b[34mDeleted post with ID ${postId}\x1b[0m`);  // Blue text
        return true;  // Return true if successfully deleted
    } catch (error) {
        console.error(`\x1b[31mError deleting post ID ${postId}:\x1b[0m`, error.response ? error.response.data : error.message);  // Red text
        return false;  // Return false if deletion failed
    }
};

const fetchPosts = async (cursor = null) => {
    try {
        const url = `https://groups.roblox.com/v1/groups/${groupId}/wall/posts?sortOrder=Asc&limit=100${cursor ? `&cursor=${cursor}` : ''}`;
        const response = await axios.get(url, {
            headers: {
                'Cookie': `.ROBLOSECURITY=${robloxToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`\x1b[31mError fetching posts:\x1b[0m`, error.response ? error.response.data : error.message);  // Red text
        return null;
    }
};

const generateHTMLReport = async (deletedPosts, totalChecked) => {
    try {
        let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Deleted Posts Report</title>
            <!-- Dark mode styles using Tailwind CSS -->
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #1a202c;
                    color: #e2e8f0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .card {
                    background-color: #2d3748;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                .card-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #cbd5e0;
                    margin-bottom: 1rem;
                }
                .post-content {
                    color: #cbd5e0;
                    border-bottom: 1px solid #4a5568;
                    padding: 1rem 0;
                }
                .post-info {
                    color: #a0aec0;
                    font-size: 0.875rem;
                }
                .post-success {
                    color: #48bb78;
                }
                .post-fail {
                    color: #f56565;
                }
                .post-body {
                    display: none;
                }
                .show-body {
                    display: block;
                }
                .dropdown-btn {
                    background-color: #2d3748;
                    color: #cbd5e0;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    border: none;
                    border-radius: 0.25rem;
                    outline: none;
                    transition: background-color 0.3s;
                }
                .dropdown-btn:hover {
                    background-color: #4a5568;
                }
            </style>
        </head>
        <body>
            <div class="max-w-3xl mx-auto p-4">
                <div class="card">
                    <h1 class="card-title">Deleted Posts Report</h1>
                    <p class="text-gray-400 mb-4">Total posts checked: ${totalChecked}</p>
                    <div class="divide-y divide-gray-700">
        `;

        // Loop through each post in deletedPosts array
        deletedPosts.forEach(post => {
            htmlContent += `
            <div class="py-4 post-content" id="post-${post.id}">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-bold text-lg ${post.deleted ? 'post-fail' : 'post-success'}">Post ID: ${post.id}</p>
                        <p class="text-sm post-info">Username: ${post.poster.username}</p>
                        <p class="text-sm post-info">Display Name: ${post.poster.displayName}</p>
                        <p class="text-sm post-info">Created: ${new Date(post.created).toLocaleString()}</p>
                        <button class="dropdown-btn" onclick="toggleBody(${post.id})">Show ${post.deleted ? 'Failed' : 'Safe'} Post Details</button>
                        <div class="post-body ${post.deleted ? 'show-body' : ''}" id="post-body-${post.id}">
                            <p class="text-sm post-info">Body:</p>
                            <p class="text-gray-400">${post.body}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        htmlContent += `
                    </div>
                </div>
            </div>
            <script>
                function toggleBody(postId) {
                    const bodyElement = document.getElementById('post-body-' + postId);
                    bodyElement.classList.toggle('show-body');
                }
            </script>
        </body>
        </html>
        `;

        await fs.writeFile('deleted_posts_report.html', htmlContent);
        console.log('\x1b[32mHTML report generated: deleted_posts_report.html\x1b[0m');  // Green text

        // Open the generated report in default browser based on platform
        await openInBrowser();
    } catch (error) {
        console.error('\x1b[31mError generating HTML report:\x1b[0m', error);
    }
};


// Function to open HTML report in default browser based on platform
const openInBrowser = async () => {
    try {
        if (process.platform === 'win32') {
            await exec('start deleted_posts_report.html');
        } else if (process.platform === 'darwin') {
            await exec('open deleted_posts_report.html');
        } else {
            await exec('xdg-open deleted_posts_report.html');
        }
    } catch (error) {
        console.error('Error opening file in browser:', error);
    }
};

const massDeleteMessages = async () => {
    try {
        await initializeNoblox();
        const authToken = await getCSRFToken();
        let cursor = null;
        let deletedPosts = [];
        let totalChecked = 0;

        console.log(`\x1b[33mStarting to fetch posts...\x1b[0m`);  // Yellow text

        do {
            const response = await fetchPosts(cursor);

            if (!response || !response.data) break;

            const posts = response.data;
            cursor = response.nextPageCursor;

            console.log(`\x1b[36mProcessing Page ${cursor ? cursor.split('_')[0] : 'null'}\x1b[0m`);  // Cyan text

            for (const post of posts) {
                totalChecked++;
                const containsKeyword = keywords.some(keyword => post.body.toLowerCase().includes(keyword.toLowerCase()));
                if (containsKeyword) {
                    console.log(`\x1b[31mPost with ID ${post.id} contains keyword, deleting...\x1b[0m`);  // Red text
                    const deleted = await deletePost(post.id, authToken);
                    deletedPosts.push({ 
                        id: post.id, 
                        body: post.body, 
                        poster: post.poster, 
                        created: post.created, 
                        deleted 
                    });
                    await delay(1000); // To avoid rate limits
                } else {
                    console.log(`\x1b[32mPost with ID ${post.id} is clean.\x1b[0m`);  // Green text
                    // Store post information for report generation
                    deletedPosts.push({ 
                        id: post.id, 
                        body: post.body, 
                        poster: post.poster, 
                        created: post.created, 
                        deleted: false  // Mark as not deleted
                    });
                }
            }
        } while (cursor);

        console.log(`\x1b[33mFinished processing all posts. Total posts checked: ${totalChecked}\x1b[0m`);  // Yellow text

        await generateHTMLReport(deletedPosts, totalChecked);
    } catch (error) {
        console.error(`\x1b[31mError during mass deletion:\x1b[0m`, error.response ? error.response.data : error.message);  // Red text
    }
};

massDeleteMessages();
