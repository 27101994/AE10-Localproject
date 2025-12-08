// Application configuration
export const APP_CONFIG = {
    // Product model - can be changed to AET 5, AET 20, etc.
    // productModel: 'ATHLEON',

    // Company branding
    companyName: 'Athieon',
    tagline: 'Track analyze and perfect your game',

    // Application metadata
    appName: 'Shooting Training System',
    version: '1.0.0',
};

// Helper function to get full product name
// export const getProductName = () => APP_CONFIG.productModel;

// Helper function to get tagline
export const getTagline = () => APP_CONFIG.tagline;

// Helper function to get company name
export const getCompanyName = () => APP_CONFIG.companyName;
