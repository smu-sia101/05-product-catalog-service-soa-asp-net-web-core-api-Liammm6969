using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using ProductCatalogService.Models;

namespace ProductCatalogService.Data
{
    public class ProductCatalogContext
    {
        private readonly IMongoDatabase _database;

        public ProductCatalogContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetConnectionString("MongoDb"));
            _database = client.GetDatabase("ProductCatalogDb");
        }

        public IMongoCollection<Product> Products => _database.GetCollection<Product>("Products");
    }
}
