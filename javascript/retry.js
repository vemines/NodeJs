fetchWithRetry = async (url = 'https://anonystick.com', errorCount = 0) => {
    const ERROR_COUNT_MAX = 3;
    const response = await fetch(url)
    if (response.status < 200 || response.status >= 300) {
        if (errorCount > ERROR_COUNT_MAX) {
            setTimeout(async () => {
                await this.fetchWithRetry(url, errorCount + 1)
            }, Math.pow(2, errorCount) * 3000 + Math.random() * 1000)   // 1st: {3 -> 4s} 2st: {12 -> 13s} 3st: {24 -> 25s}
        }
    }
    return response;
}