using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginCustomerRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Id) || request.TableId < 0)
                return BadRequest("Invalid ID or TableId.");

            try
            {
                var customer = DBServices.LoginCustomer(request.Id, request.TableId);
                return Ok(customer);
            }
            catch (SqlException sqlEx)
            {
                // Gérer les erreurs RAISERROR venant du SQL
                return BadRequest(sqlEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("table/{tableId}")]
        public IActionResult GetAllUsersByTableId(int tableId)
        {
            try
            {
                var customers = DBServices.GetAllCustomersByTableId(tableId);
                if (customers == null || customers.Count == 0)
                    return NoContent(); // ou NotFound()

                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterCustomerRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Id) ||
                string.IsNullOrWhiteSpace(request.Contact) ||
                string.IsNullOrWhiteSpace(request.FirstName) ||
                request.TableId < 0)
            {
                return BadRequest("Missing or invalid parameters.");
            }

            try
            {
                DBServices.RegisterCustomer(request.Id, request.Contact, request.FirstName, request.TableId);
                return Ok(new { Message = "Customer registered and assigned to table." });
            }
            catch (SqlException sqlEx)
            {
                // Gérer les RAISERROR venant de SQL Server
                return BadRequest(sqlEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("disconnect")]
        public IActionResult DisconnectCustomer([FromBody] DisconnectCustomerRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.CustomerId))
                return BadRequest("Customer ID is required.");

            try
            {
                DBServices.DisconnectCustomer(request.CustomerId);
                return Ok(new { Message = "Customer disconnected successfully." });
            }
            catch (SqlException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }

    public class DisconnectCustomerRequest
    {
        public string CustomerId { get; set; }
    }

    public class LoginCustomerRequest
    {
        public string Id { get; set; }
        public int TableId { get; set; }
    }

    public class RegisterCustomerRequest
    {
        public string Id { get; set; }
        public string Contact { get; set; }
        public string FirstName { get; set; }
        public int TableId { get; set; }
    }
}
