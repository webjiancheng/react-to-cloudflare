import { MastraClient } from '@mastra/client-js';

const client = new MastraClient({
	// 配置选项，例如：
	// baseUrl: 'https://agent.pandatest.site',
	baseUrl: 'https://mastra-workers.nevermoyan.workers.dev',
});
// 添加一些辅助方法或扩展功能（如果需要）
const enhancedClient = {
	...client,

	// 如果getAgent不是异步的但您需要它是异步的
	getAgent: async (agentName: string) => {
		// 可能需要处理异步逻辑
		return client.getAgent(agentName);
	},

	// 其他自定义方法...
};
export default enhancedClient;
