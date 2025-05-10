import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
        return NextResponse.json(
            { error: 'Username is required' },
            { status: 400 }
        )
    }

    const graphqlQuery = {
        query: `
            query userProfileUserQuestionProgressV2($userSlug: String!) {
                userProfileUserQuestionProgressV2(userSlug: $userSlug) {
                    numAcceptedQuestions {
                        count
                        difficulty
                    }
                    numFailedQuestions {
                        count
                        difficulty
                    }
                    numUntouchedQuestions {
                        count
                        difficulty
                    }
                    userSessionBeatsPercentage {
                        difficulty
                        percentage
                    }
                    totalQuestionBeatsPercentage
                }
            }
        `,
        variables: {
            userSlug: username,
        },
    }

    try {
        // console.log(
        //     `API Route: Fetching LeetCode data for ${username} from LeetCode GraphQL API`
        // )
        const leetcodeResponse = await fetch('https://leetcode.com/graphql/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json', // LeetCode expects application/json
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
                Referer: `https://leetcode.com/u/${username}/`, // Dynamic Referer based on username
                'sec-ch-ua':
                    '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                // Add other headers from your cURL if needed, but start with these common ones.
                // 'origin': 'https://leetcode.com', // Origin might be problematic for server-side requests if not set to the actual server making the request
            },
            body: JSON.stringify(graphqlQuery),
        })

        if (!leetcodeResponse.ok) {
            const errorBody = await leetcodeResponse.text()
            console.error(
                `LeetCode API Error (${leetcodeResponse.status}): ${errorBody}`
            )
            return NextResponse.json(
                {
                    error: `LeetCode API error: ${leetcodeResponse.statusText}`,
                    details: errorBody,
                },
                { status: leetcodeResponse.status }
            )
        }

        const data = await leetcodeResponse.json()
        // console.log(
        //     `API Route: Successfully fetched LeetCode data for ${username}`
        // )
        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Error in LeetCode API route:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}
