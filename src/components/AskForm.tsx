import { useLazyQuery } from "@apollo/client";
import { ASK_QUERY } from "../graphsql";
import { useState } from "react";
import AnswerDisplay from "./AnswerDisplay";
import '../styles/common.css';
import mastraClient from '../utils/MastraClient';
import type { AgentResponse, GraphQLAnswerResponse, AgentError } from "../types";

// 定义聊天消息类型
interface ChatMessage {
    role: string;    // 消息角色（user 或 assistant）
    content: string; // 消息内容
}

export default function AskForm() {
    // 用户输入内容
    const [prompt, setPrompt] = useState<string>('');
    // 是否使用Code Review Agent模式
    const [useCodeReview, setUseCodeReview] = useState<boolean>(false);
    // 聊天历史记录
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    // GraphQL 查询相关状态
    const [getAnswer, { loading: queryLoading, error: queryError, data: queryData }] = useLazyQuery<GraphQLAnswerResponse>(ASK_QUERY);
    // Agent模式下的响应、加载和错误状态
    const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(null);
    const [agentLoading, setAgentLoading] = useState<boolean>(false);
    const [agentError, setAgentError] = useState<AgentError | null>(null);

    // 添加消息到聊天历史
    const addMessageToHistory = (role: string, content: string) => {
        setChatHistory(prevHistory => [...prevHistory, { role, content }]);
    };

    // 处理表单提交（发送消息）
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!prompt.trim()) return; // 输入为空不处理

        // 用户消息加入历史
        addMessageToHistory('user', prompt);

        // 清空输入框
        setPrompt('');

        if (useCodeReview) {
            // 使用Code Review Agent模式
            setAgentLoading(true);
            setAgentResponse(null);
            setAgentError(null);

            try {
                // 获取Agent实例
                const agentInstance = await mastraClient.getAgent('codeReviewerAgent');
                // 发送用户消息给Agent
                const userMessage = prompt;
                const response = await agentInstance.generate({
                    messages: [
                        {
                            role: "user",
                            content: userMessage
                        }
                    ]
                });

                setAgentResponse(response as AgentResponse);

                // 处理Agent响应结果并加入历史
                let answerText: string;
                if ('text' in response && response.text) {
                    answerText = response.text;
                } else {
                    // 没有text字段时，直接序列化整个响应
                    answerText = JSON.stringify(response, null, 2);
                }
                addMessageToHistory('assistant', answerText);
            } catch (err) {
                // Agent调用出错
                console.error('调用Agent时出错:', err);
                const error: AgentError = {
                    message: err instanceof Error ? err.message : '调用Agent失败',
                };
                setAgentError(error);
            } finally {
                setAgentLoading(false);
            }
        } else {
            // 普通问答模式，使用GraphQL查询
            getAnswer({
                variables: { prompt },
                onCompleted: (data) => {
                    // 回答加入历史
                    if (data && data.ask) {
                        addMessageToHistory('assistant', data.ask);
                    }
                }
            });
        }
    };

    // 处理回车发送（Shift+Enter换行）
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // 当前的加载和错误状态（根据模式切换）
    const loading = useCodeReview ? agentLoading : queryLoading;
    const error = useCodeReview ? agentError : queryError;

    // 整合要传递给AnswerDisplay的数据
    let displayData: { answer: string } | GraphQLAnswerResponse | null = null;

    if (useCodeReview && agentResponse) {
        // Agent模式下，处理响应
        let answerText: string;
        if ('text' in agentResponse && agentResponse.text) {
            answerText = agentResponse.text;
        } else {
            answerText = JSON.stringify(agentResponse, null, 2);
        }
        displayData = { answer: answerText };
    } else if (!useCodeReview && queryData) {
        // 普通问答模式下，直接用GraphQL响应
        displayData = queryData;
    }

    // 组件渲染
    return (
        <div className="chat-container">
            {/* 答案展示区 */}
            <div className="answer-panel">
                <div className="answer-container">
                    <AnswerDisplay
                        loading={loading}
                        error={error}
                        data={displayData}
                        chatHistory={chatHistory}
                    />
                </div>
            </div>

            {/* 输入区 */}
            <div className="input-panel">
                {/* 模式切换（普通问答/Code Review） */}
                <div className="mode-selector">
                    <label className={`mode-label ${useCodeReview ? 'active' : ''}`}>
                        <input
                            type="checkbox"
                            checked={useCodeReview}
                            onChange={(e) => setUseCodeReview(e.target.checked)}
                            className="mode-checkbox"
                        />
                        使用Code Review Agent
                    </label>
                </div>
                {/* 输入表单 */}
                <div className="input-container">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value)
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={useCodeReview ? "输入代码进行review..." : "输入你的问题..."}
                            className="chat-input"
                            rows={1}
                        />
                        <button
                            type="submit"
                            disabled={loading || !prompt.trim()}
                            className="submit-button"
                            title={loading ? "思考中..." : "发送"}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="currentColor"
                            >
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}