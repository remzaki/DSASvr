using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AutomationServer.Models;

namespace AutomationServer.Controllers
{
    [Authorize]
    public class ElementsController : ApiController
    {
        private AutomationServerContext db = new AutomationServerContext();

        // GET: api/Elements
        [AllowAnonymous]
        public IQueryable<ElementDTO> GetElements()
        {
            var elements = from e in db.Elements
                           select new ElementDTO()
                           {
                               Name = e.Name,
                               Value = e.Value,
                               Desc = e.Description,
                               Screenshot = e.Screenshot != null
                           };
            return elements;
        }

        // GET: api/Elements?name=element_name&min=false
        [AllowAnonymous]
        [ResponseType(typeof(ElementDetailDTO))]
        public async Task<IHttpActionResult> GetElement(string name, bool min = false)
        {
            object element = null;
            if (min)
            {
                element = await db.Elements.Include(e => e.Name).Select(e =>
                new ElementDetailDTO()
                {
                    Name = e.Name,
                    Value = e.Value,
                    Desc = e.Description
                }).SingleOrDefaultAsync(e => e.Name == name);
            }
            else
            {
                element = await db.Elements.Include(e => e.Name).Select(e =>
                new ElementDetailDTO()
                {
                    Name = e.Name,
                    Value = e.Value,
                    Desc = e.Description,
                    Screenshot = e.Screenshot
                }).SingleOrDefaultAsync(e => e.Name == name);
            }

            if (element == null)
            {
                return NotFound();
            }

            return Ok(element);
        }

        // PUT: api/Elements?name=element_name
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutElement(string name, Element element)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (name != element.Name)
            {
                return BadRequest();
            }

            db.Entry(element).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ElementExists(name))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Elements
        [ResponseType(typeof(Element))]
        public async Task<IHttpActionResult> PostElement(Element element)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Elements.Add(element);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ElementExists(element.Name))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            var dto = new ElementDetailDTO()
            {
                Name = element.Name,
                Value = element.Value,
                Desc = element.Description
            };

            return CreatedAtRoute("DefaultApi", new { id = element.Name }, dto);
        }

        // DELETE: api/Elements?name=element_name
        [ResponseType(typeof(Element))]
        public async Task<IHttpActionResult> DeleteElement(string name)
        {
            Element element = await db.Elements.FindAsync(name);
            if (element == null)
            {
                return NotFound();
            }

            db.Elements.Remove(element);
            await db.SaveChangesAsync();

            return Ok(element);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ElementExists(string id)
        {
            return db.Elements.Count(e => e.Name == id) > 0;
        }
    }
}