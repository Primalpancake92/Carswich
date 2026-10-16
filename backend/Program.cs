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

app.UseCors("Frontend");

app.MapBuyerRegRoute();
app.MapDealerRegRoute();
app.MapDealerAuthRoute();
app.MapAddCarRoute();
app.MapGetDealerInventoryRoute();

app.MapCarBrowseRoute();
app.MapCarDetailsRoute();

app.MapBuyerPurchaseRoute();
app.MapPurchaseHistoryRoute();

app.Run();

