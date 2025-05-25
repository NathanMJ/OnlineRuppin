using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Get(int id)
        {
            try
            {
                Table table = DBServices.GetTableById(id);

                if (table == null)
                    return NotFound(); // 404 si pas trouvée

                return Ok(table); // 200 avec la table en JSON
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("tableId/{linkId}")]
        public IActionResult GetTableId(int linkId)
        {
            try
            {
                int? tableId = DBServices.GetTableIdWithLinkId(linkId);
                if (tableId.HasValue)
                    return Ok(tableId);
                else
                    return NoContent(); // ou NotFound(), si tu veux
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }

}
