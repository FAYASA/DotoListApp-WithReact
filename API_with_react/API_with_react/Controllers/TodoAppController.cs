using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace API_with_react.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoAppController : ControllerBase
    {
        private IConfiguration _config;

        public TodoAppController(IConfiguration config)
        {
            _config = config;
        }


        [HttpGet]
        [Route("GetNotes")]

        public JsonResult GetNotes()
        {
            string Query = "Select * from dbo.Notes";
            DataTable table = new DataTable();
            string SqlDataSource = _config.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;

            using(SqlConnection myCon = new SqlConnection(SqlDataSource))
            {
                myCon.Open();
                using (SqlCommand sqlCommand = new SqlCommand(Query,myCon))
                {
                    myReader = sqlCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }

        [HttpPost]
        [Route("AddNotes")]

        public JsonResult AddNotes([FromForm] string newNotes)
        {
            string Query = "Insert into dbo.Notes values(@newNotes)";
            DataTable table = new DataTable();
            string SqlDataSource = _config.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;

            using (SqlConnection myCon = new SqlConnection(SqlDataSource))
            {
                myCon.Open();
                using (SqlCommand sqlCommand = new SqlCommand(Query, myCon))
                {
                    sqlCommand.Parameters.AddWithValue("@newNotes", newNotes);
                    myReader = sqlCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Added successfully");
        }

        [HttpDelete]
        [Route("DeleteNotes")]

        public JsonResult DeleteNotes( int id)
        {
            string Query = "delete from dbo.Notes where id = @id";
            DataTable table = new DataTable();
            string SqlDataSource = _config.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;

            using (SqlConnection myCon = new SqlConnection(SqlDataSource))
            {
                myCon.Open();
                using (SqlCommand sqlCommand = new SqlCommand(Query, myCon))
                {
                    sqlCommand.Parameters.AddWithValue("@id", id);
                    myReader = sqlCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Deleted successfully");
        }
    }
}
