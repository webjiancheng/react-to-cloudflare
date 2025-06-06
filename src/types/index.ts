// types.ts - 添加到项目中
export interface GraphQLAnswerResponse {
	ask?: string;
}

// 根据库的实际定义调整这些类型
export interface CoreMessage {
	role: string;
	content: string;
}

// 不再使用空接口，直接使用CoreMessage或添加实际成员
// 如果需要区分不同消息类型，可以添加额外字段
export interface MessageWithMetadata extends CoreMessage {
	id?: string;
	timestamp?: number;
	// 其他可能的元数据
}

export interface AgentChoice {
	message: {
		content: string;
		role?: string;
	};
}

export interface AgentResponse {
	text?: string;
	choices?: AgentChoice[];
	error?: string;
}

export interface GraphQLError {
	message: string;
	locations?: unknown[];
	path?: string[];
	extensions?: Record<string, unknown>;
}

export interface AgentError {
	message: string;
	code?: string;
	details?: unknown;
}
