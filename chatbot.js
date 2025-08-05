module.exports = {
  generateResponse: (text) => {
    const responses = {
      "سلام": "سلام! چطور می‌تونم کمک کنم؟",
      "هوش مصنوعی": "من یک چت‌بات ساده هستم!",
      "خداحافظ": "خداحافظ! ممنون از گفتگوی شما."
    };
    return responses[text] || null;
  }
};
