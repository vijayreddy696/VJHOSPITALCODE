using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalApi.Migrations
{
    /// <inheritdoc />
    public partial class qualification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Specialization_Departments_DepartmentId",
                table: "Specialization");

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentId",
                table: "Specialization",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "Qualifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullForm = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HospitalId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Qualifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Qualifications_Hospitals_HospitalId",
                        column: x => x.HospitalId,
                        principalTable: "Hospitals",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Qualifications_HospitalId",
                table: "Qualifications",
                column: "HospitalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Specialization_Departments_DepartmentId",
                table: "Specialization",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Specialization_Departments_DepartmentId",
                table: "Specialization");

            migrationBuilder.DropTable(
                name: "Qualifications");

            migrationBuilder.AlterColumn<int>(
                name: "DepartmentId",
                table: "Specialization",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Specialization_Departments_DepartmentId",
                table: "Specialization",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
