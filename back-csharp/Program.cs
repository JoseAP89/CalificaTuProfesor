using back_csharp._configs;
using back_csharp._contracts;
using back_csharp._data;
using back_csharp._repos;
using back_csharp._services;
using back_csharp.Middleware;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


// connection to postgres
var connString = builder.Configuration.GetConnectionString("TeachersDB");
builder.Services.AddDbContext<TeachersContext>(opt =>{
    opt.UseNpgsql(connString);
});

// Register the AxumService with typed HttpClient

// DI SERVICES
var axumUrl = builder.Configuration["Servers:Axum"];
builder.Services.AddHttpClient<IAxumService, AxumService>(client =>
{
    try
    {
        client.BaseAddress = new Uri(axumUrl.Trim());
        client.Timeout = TimeSpan.FromSeconds(30);
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
    }
    catch (UriFormatException ex)
    {
        throw new ApplicationException($"Invalid Axum URL format: '{axumUrl}'", ex);
    }
});
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
    );
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SETTING UP CORS
const string POLICY = "AllowAll";
builder.Services.AddCors(opt => {
    opt.AddPolicy(POLICY,
        policy => policy
            .WithOrigins(
                "http://localhost:3000", // axum server
                "http://localhost:4200", // angular dev server
                "http://localhost:8080" // nginx
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});
builder.Services.AddAutoMapper(typeof(AutoMapperConfigs));
var app = builder.Build();
// Configure error handling middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors(POLICY);

app.UseAuthorization();

app.MapControllers();

app.Run();
