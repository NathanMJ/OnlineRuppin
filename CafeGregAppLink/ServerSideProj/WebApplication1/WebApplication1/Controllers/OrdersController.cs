using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        // GET api/orders/table/3
        [HttpGet("table/{tableId}")]
        public IActionResult GetOrdersByTableId(int tableId)
        {
            try
            {
                var orders = DBServices.GetOrdersByTableId(tableId);
                if (orders == null || orders.Count == 0)
                    return NoContent(); // 204 si pas de commandes

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}
