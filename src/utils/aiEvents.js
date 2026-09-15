export const notifyAIComplete = () => {
    window.dispatchEvent(new Event('resuai:ai-complete'));
};
