using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalApi.Migrations
{
    /// <inheritdoc />
    public partial class asdfasdf : Migration
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddForeignKey(
                name: "FK_Specialization_Departments_DepartmentId",
                table: "Specialization",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id");
        }
    }
}
