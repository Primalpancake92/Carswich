using System.Collections;
using System.Net;
using System.Net.Http.Json;
using backend.DTO;
using Microsoft.AspNetCore.Mvc.Testing;


namespace backend.Tests
{
    [TestFixture]
    public class LoginBuyerApiTests
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
        public async Task TestLoginRouteSuccess()
        {
            // make the request bodies
            LoginRequest[] reqBodyArr =
            {
                new LoginRequest("alex@example.com", "password123"),
                new LoginRequest("sam@example.com", "password123"),
                new LoginRequest("priya@example.com", "password123")
            };

            foreach (LoginRequest req in reqBodyArr)
            {
                HttpResponseMessage response = await client.PostAsJsonAsync(
                    "/api/buyers/login", req
                );

                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK),
                    $"Login failure for {req.Email}"
                );
            }
        }

        public async Task TestLoginRouteFakeAccounts()
        {
            LoginRequest[] reqBodyArr =
            {
                new LoginRequest("ghost@example.com", "password123"),
                new LoginRequest("nobody@carswich.com", "password123"),
                new LoginRequest("alex.taylor@example.com", "password123"),
                new LoginRequest("sam@example.org", "password123"),
                new LoginRequest("jordanharbourmotors.example", "password123")
            };

            foreach (LoginRequest req in reqBodyArr)
            {
                HttpResponseMessage response = await client.PostAsJsonAsync(
                    "/api/buyers/login", req
                );

                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest),
                    $"Login should not have passed for {req.Email}"
                );
            }
        }
    }
}