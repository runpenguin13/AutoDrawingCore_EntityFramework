using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using AutoDrawing.Models.DrawingDemo;
using AutoDrawing.Models.KJERPX;
using Newtonsoft.Json.Linq;

namespace AutoDrawing.Controllers
{
    public class EntitiesController : Controller
    {
        private readonly DrawingDemoContext db;
        private readonly KJERPXContext db2;

        public EntitiesController(DrawingDemoContext context, KJERPXContext context2)
        {
            db = context;
            db2 = context2;
        }

        public IActionResult Index()
        {
            ViewBag.CompanyIdx = new SelectList(db2.XCompanies, "CompanyIdx", "CompanyName");
            return View();
        }

        public string EditEntity(Entity entity)
        {
            db.Entry(entity).State = EntityState.Modified;
            db.SaveChanges();

            return "Success";
        }

        public JObject LoadItem(int id)
        {
            Entity entity = db.Entities.Find(id);


            JObject objEntity = new JObject();
            objEntity.Add("id", entity.Id);
            objEntity.Add("name", entity.Name);
            objEntity.Add("code", entity.Code);
            objEntity.Add("CompanyIdx", entity.CompanyIdx);


            return objEntity;
        }

        public string DeleteEntity(int[] arrId)
        {
            foreach (int id in arrId)
            {
                Entity entity = db.Entities.Find(id);
                db.Entities.Remove(entity);
                db.SaveChanges();
            }

            return "Success";
        }

        public string CreateEntity(Entity entity)
        {
            if (entity.Name == null)
                return "Name 항목을 입력하세요.";

            if (entity.Code == null)
                return "Code 항목을 입력하세요.";


            db.Entities.Add(entity);
            db.SaveChanges();

            return "Success";
        }

        public JArray EntityList()
        {
            JArray arrEntity = new JArray();

            foreach (var entity in db.Entities.ToList())
            {
                JObject objEntity = new JObject();

                objEntity.Add("Id", entity.Id);
                objEntity.Add("Name", entity.Name);
                objEntity.Add("Code", entity.Code);
                objEntity.Add("CompanyIdx", entity.CompanyIdx == null ? null : db2.XCompanies.Find(entity.CompanyIdx).CompanySname);

                arrEntity.Add(objEntity);
            }

            return arrEntity;
        }
    }
}
