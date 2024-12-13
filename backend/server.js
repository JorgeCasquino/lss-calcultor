const app = require('./src/app');
const config = require('./src/config/config');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- /api/auth');
    console.log('- /api/defects');
    console.log('- /api/production');
});