using back_csharp._configs;
using back_csharp._data;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


// connection to postgres
var connString = builder.Configuration.GetConnectionString("TeachersDB");
builder.Services.AddDbContext<TeachersContext>(opt =>{
    opt.UseNpgsql(connString);
});


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

const string POLICY = "AllowAll";
builder.Services.AddCors(opt => {
    opt.AddPolicy(POLICY,
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});
builder.Services.AddAutoMapper(typeof(AutoMapperConfigs));
var app = builder.Build();

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
