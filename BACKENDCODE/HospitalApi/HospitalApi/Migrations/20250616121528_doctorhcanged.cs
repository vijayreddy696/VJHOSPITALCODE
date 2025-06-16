using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalApi.Migrations
{
    /// <inheritdoc />
    public partial class doctorhcanged : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Doctor");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Doctor");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Doctor");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Doctor");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Doctor");

            migrationBuilder.AddColumn<int>(
                name: "PersonalDetailsId",
                table: "Doctor",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Doctor_PersonalDetailsId",
                table: "Doctor",
                column: "PersonalDetailsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Doctor_Users_PersonalDetailsId",
                table: "Doctor",
                column: "PersonalDetailsId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Doctor_Users_PersonalDetailsId",
                table: "Doctor");

            migrationBuilder.DropIndex(
                name: "IX_Doctor_PersonalDetailsId",
                table: "Doctor");

            migrationBuilder.DropColumn(
                name: "PersonalDetailsId",
                table: "Doctor");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Doctor",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Doctor",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Doctor",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Doctor",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Doctor",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
