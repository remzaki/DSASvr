using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Web.Mvc;
using AutomationServer.Models;
using Newtonsoft.Json;

namespace AutomationServer.Controllers
{
    public class ElementController : Controller
    {
        private AutomationServerContext db = new AutomationServerContext();
        private ElementsController ec = new ElementsController();
        // GET: Element
        public ActionResult Index()
        {
            ViewBag.Title = "Elements";

            return View();
        }

        public ActionResult Offline()
        {
            var elements = ec.GetElements();
            var json = JsonConvert.SerializeObject(elements.ToArray());
            var data = Encoding.UTF8.GetBytes(json);
            var doc = new {
                Data = data,
                ContentType = "application/json",
                FileName = String.Format("Elements_{0}.json", DateTime.Now.ToString("yyyyMMddhhmm"))
            };
            var cd = new System.Net.Mime.ContentDisposition
            {
                FileName = doc.FileName,
                Inline = false,
            };

            Response.AppendHeader("Content-Disposition", cd.ToString());
            return File(doc.Data, doc.ContentType);
        }
    }
}