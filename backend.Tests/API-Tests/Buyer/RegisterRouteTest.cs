using System.Collections;
using System.Net;
using System.Net.Http.Json;
using backend.DTO;
using Microsoft.AspNetCore.Mvc.Testing;


namespace backend.Tests
{
    [TestFixture]
    public class RegisterRouteTest
    {
        private WebApplicationFactory<Program> factory = null!;
        private HttpClient client = null!;

        [SetUp]
        public void Setup()
        {
            factory = new WebApplicationFactory<Program>().WithWebHostBuilder(
                builder =>
                {
                    builder.UseSetting(
                        "ConnectionStrings:DefaultConnection",
                        "Data Source=carswich-test.db"
                    );
                }
            );
            
            client = factory.CreateClient();
        }

        [TearDown]
        public void TearDown()
        {
            client.Dispose();
            factory.Dispose();
        }

        [Test]
        public async Task BuyerSuccessRegister()
        {
            
        }
    }
}