using backend.DAL;
using backend.Models;
using backend.Routes.Buyers;
using backend.Routes.Dealers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddValidation();

// Hashes passwords on register and checks them on login
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

// CORS: the frontend pages are served from a different origin than this API,
// so the browser only lets them call it if their origin is allowed here.
// Origins are in appsettings.json: VS Code Live Server (port 5500), and "null",
// which is what the browser sends when an HTML file is opened straight from disk.
const string FrontendCorsPolicy = "Frontend";
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

// Development only: add sample buyers (DAL/DbSeeder.cs) if they aren't in the database yet
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

    await DbSeeder.SeedBuyersAsync(db, hasher);
}

app.UseCors(FrontendCorsPolicy);

// Buyer CRUD
app.MapBuyerRegRoute();
app.MapBuyerAuthRoute();
app.MapBuyerUpdateRoute();
app.MapBuyerDeleteRoute();

// Dealer CRUD
app.MapDealerRegRoute();
app.MapDealerAuthRoute();
app.MapDealerUpdateRoute();
app.MapDealerDeleteRoute();

app.Run();
