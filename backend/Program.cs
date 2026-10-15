using backend.DAL;
using backend.Routes.Buyers;
using backend.Routes.Cars;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddValidation();

var app = builder.Build();

app.MapBuyerRegRoute();
app.MapCarBrowseRoute();


app.Run();
