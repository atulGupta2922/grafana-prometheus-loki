function mockLatencyAndErrors() {
    return new Promise((resolve, reject) => {
        const latency = Math.floor(Math.random() * 1000);
        setTimeout(() => {
            if (Math.random() < 0.5) {
                reject(new Error('Random error occurred'));
            } else {
                resolve();
            }
        }, latency);
    });
}

module.exports = {
    mockLatencyAndErrors
};