using backend.DAL;
using backend.Routes.Buyers;
using backend.Routes.Dealer;
using backend.Routes.addCar;
using backend.Routes.Inventory;
using backend.Routes.Cars;
using backend.Routes.Purchases;
using backend.Controllers.Buyers;

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddValidation();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5500",
            "http://127.0.0.1:5500"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

// Every start: empty the database and fill it with the same test data (DAL/DbSeeder.cs)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbSeeder.ResetAsync(db);
}

app.UseCors("Frontend");

app.MapBuyerRegRoute();
app.MapBuyerAuthRoute();
app.MapBuyerProfileRoute();
app.MapDealerRegRoute();
app.MapDealerAuthRoute();
app.MapDealerListRoute();
app.MapDealerAccountRoute();
app.MapAddCarRoute();
app.MapGetDealerInventoryRoute();

app.MapCarBrowseRoute();
app.MapCarDetailsRoute();

app.MapBuyerPurchaseRoute();
app.MapBuyerDepositRoute();
app.MapPurchaseHistoryRoute();

app.Run();

