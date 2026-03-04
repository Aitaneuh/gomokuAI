using GomokuAI;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();



app.MapPost("/api/cs/play", (PlayRequest data) =>
{
    if (data == null || string.IsNullOrEmpty(data.BlackBitboard) || string.IsNullOrEmpty(data.WhiteBitboard))
    {
        return Results.BadRequest(new { error = "Missing bitboards" });
    }

    var bratchoku = new Bratchoku();
    int depth = 7;

    try
    {
        // conv hex
        ulong blackBitboard = ulong.Parse(data.BlackBitboard, NumberStyles.HexNumber);
        ulong whiteBitboard = ulong.Parse(data.WhiteBitboard, NumberStyles.HexNumber);

        var (move, time, nodes) = bratchoku.Play(blackBitboard, whiteBitboard, depth);

        double timeTaken = time > 0 ? time : 0.01;

        return Results.Ok(new
        {
            move,
            depth,
            time,
            nodes,
            nps = (long)(nodes / timeTaken)
        });
    }
    catch (FormatException)
    {
        return Results.BadRequest(new { error = "Invalid hex format" });
    }
})
.WithName("C#Play");

app.Urls.Add("http://127.0.0.1:3000");
app.Run();