

export default eventHandler(async (event) => {
    const randomLength = Math.floor(Math.random() * 20) + 1;
    return Array.from({ length: randomLength }, () => Math.floor(Math.random() * 5) + 1).reverse();
})




