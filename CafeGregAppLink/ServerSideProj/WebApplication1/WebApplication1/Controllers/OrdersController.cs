using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

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

    // POST api/orders/order
    [HttpPost("order")]
    public IActionResult OrderProduct([FromBody] OrderRequest request)
    {
        if (request == null || request.ProductId < 0 || request.TableId < 0)
            return BadRequest("Invalid product or table ID.");

        try
        {
            int newOrderId = DBServices.OrderProductById(request.ProductId, request.TableId);
            return Ok(new { OrderId = newOrderId });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("cancel")]
    public IActionResult CancelOrder([FromBody] CancelOrderRequest request)
    {
        if (request == null || request.OrderId < 0)
            return BadRequest("Invalid order ID.");

        try
        {
            DBServices.CancelOrder(request.OrderId);
            return Ok(new { Message = "Order canceled successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("change-status")]
    public IActionResult ChangeOrderStatus([FromBody] ChangeOrderStatusRequest request)
    {
        if (request == null || request.OrderId < 0 || request.NewStatus < 0)
            return BadRequest("Invalid order ID or status.");

        try
        {
            int updatedStatus = DBServices.ChangeOrderStatus(request.OrderId, request.NewStatus);
            return Ok(new { Message = "Order status updated successfully.", StatusId = updatedStatus });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}

public class CancelOrderRequest
{
    public int OrderId { get; set; }
}


public class OrderRequest
{
    public int ProductId { get; set; }
    public int TableId { get; set; }
}

public class ChangeOrderStatusRequest
{
    public int OrderId { get; set; }
    public int NewStatus { get; set; }
}
