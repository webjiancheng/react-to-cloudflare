import React from 'react';
import '../styles/common.css';
import '../styles/markdown-styles.css'; // 导入Markdown样式
import type { GraphQLAnswerResponse, GraphQLError, AgentError } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
    role: string;
    content: string;
}

interface AnswerDisplayProps {
    loading: boolean;
    error: GraphQLError | AgentError | null | undefined;
    data: GraphQLAnswerResponse | { answer: string } | null;
    chatHistory: ChatMessage[];
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ loading, error, data, chatHistory }) => {
    if (error) {
        return <div className="error-message">出错了: {error.message}</div>;
    }

    if (!data && chatHistory.length === 0) {
        return <div className="empty-state">请输入您的问题</div>;
    }

    return (
        <div>
            {chatHistory.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
            ))}
            {loading && <div className="message assistant">正在思考...</div>}
        </div>
    );
};

export default AnswerDisplay;