using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalApi.Migrations
{
    /// <inheritdoc />
    public partial class hospitalmodelchange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Hospitals_HospitalId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Hospitals");

            migrationBuilder.DropColumn(
                name: "OwnerEmail",
                table: "Hospitals");

            migrationBuilder.DropColumn(
                name: "OwnerName",
                table: "Hospitals");

            migrationBuilder.RenameColumn(
                name: "OwnerPhoneNumber",
                table: "Hospitals",
                newName: "HospitalAddress");

            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "Hospitals",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Hospitals_OwnerId",
                table: "Hospitals",
                column: "OwnerId",
                unique: true,
                filter: "[OwnerId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Hospitals_Users_OwnerId",
                table: "Hospitals",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Hospitals_HospitalId",
                table: "Users",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hospitals_Users_OwnerId",
                table: "Hospitals");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Hospitals_HospitalId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Hospitals_OwnerId",
                table: "Hospitals");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Hospitals");

            migrationBuilder.RenameColumn(
                name: "HospitalAddress",
                table: "Hospitals",
                newName: "OwnerPhoneNumber");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Hospitals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OwnerEmail",
                table: "Hospitals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OwnerName",
                table: "Hospitals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Hospitals_HospitalId",
                table: "Users",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "Id");
        }
    }
}
