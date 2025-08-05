using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        // Exemple en GET avec query param
        [HttpGet("search")]
        public IActionResult SearchProducts([FromQuery] string searchText)
        {
            if (string.IsNullOrWhiteSpace(searchText))
                return BadRequest("Search text is required.");

            try
            {
                var products = DBServices.SearchProductsByName(searchText);

                if (products == null || products.Count == 0)
                    return NoContent(); // 204 No content si rien trouvé

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

}
