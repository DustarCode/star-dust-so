import {NextRequest} from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 从环境变量获取API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_SEARCH_URL || '';

        // 转发请求到目标API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // 获取响应数据
        const data = await response.json();

        // 返回响应
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('搜索API错误:', error);
        return new Response(
            JSON.stringify({error: '搜索服务暂时不可用'}),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}

export async function GET() {
    try {
        // 从环境变量获取健康检查URL
        const healthUrl = process.env.NEXT_PUBLIC_API_SEARCH_URL?.replace('/search', '/health') || '';

        // 转发GET请求到目标API
        const response = await fetch(healthUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 获取响应数据
        const text = await response.text();

        // 尝试解析JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('JSON解析错误:', parseError);
            console.error('响应文本:', text);
            data = {status: 'unknown', message: '无法解析健康检查响应'};
        }

        // 返回响应
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('健康检查API错误:', error);
        return new Response(
            JSON.stringify({error: '健康检查服务暂时不可用', details: (error as Error).message}),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}