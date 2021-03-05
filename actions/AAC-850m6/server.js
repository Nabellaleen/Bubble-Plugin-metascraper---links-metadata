function(properties, context) {
    const metascraper = require("metascraper")([
      require("metascraper-author")(),
      require("metascraper-date")(),
      require("metascraper-description")(),
      require("metascraper-image")(),
      require("metascraper-logo")(),
      require("metascraper-clearbit")(),
      require("metascraper-publisher")(),
      require("metascraper-title")(),
      require("metascraper-url")(),
    ]);
    const got = require("got");

    const urls = properties.urls.get(0, properties.urls.length());

    const getMetadata = async (targetUrl) => {
        const { body: html, url } = await got(
            targetUrl
        );
        const metadata = await metascraper({
            html,
            url,
        });
        return {
            "_p_author": metadata.author,
            "_p_date": metadata.date,
            "_p_description": metadata.description,
            "_p_image":  metadata.image,
            "_p_logo":  metadata.logo,
            "_p_publisher":  metadata.publisher,
            "_p_title":  metadata.title,
            "_p_url":  metadata.url
        };
    };
    return context.async( async callback => {
        try {
            let result = await Promise.all(urls.map((url) => getMetadata(url)));
            callback( undefined, {
                metadata_list: result,
            });
        }
        catch ( err ) {
            callback( err );
        }
    });
}