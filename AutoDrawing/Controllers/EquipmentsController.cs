using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using AutoDrawing.Models.DrawingDemo;
using Newtonsoft.Json.Linq;

namespace AutoDrawing.Controllers
{
    public class EquipmentsController : Controller
    {
        //private readonly DrawingDemoContext _context;
        private readonly DrawingDemoContext db;

        public EquipmentsController(DrawingDemoContext context)
        {
            //_context = context;
            db = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public JArray List(string filter)
        {
            var equipments = db.Equipments.Where(p => p.Name.Contains(filter ?? ""));

            JArray arr = new JArray();
            foreach (var equip in equipments)
            {
                JObject obj = new JObject();

                obj.Add("Id", equip.Id);
                obj.Add("Group", equip.Group);
                obj.Add("Name", equip.Name);
                obj.Add("FormalName", equip.FormalName);
                obj.Add("Desc", equip.Desc);

                arr.Add(obj);
            }

            return arr;
        }

        // Create
        public string Create(Equipment equipment)
        {
            if (string.IsNullOrEmpty(equipment.Group) || string.IsNullOrEmpty(equipment.Name) || string.IsNullOrEmpty(equipment.FormalName))
                return "빈 항목이 있습니다.";

            equipment.Name = equipment.Name.Trim();
            equipment.FormalName = equipment.FormalName.Trim();
            equipment.Group = equipment.Group.Trim();

            equipment.Date = DateTime.Now;
            equipment.User = User.Identity.Name;

            db.Equipments.Add(equipment);
            db.SaveChanges();

            return "Success";
        }

        // Delete
        public void Delete(int[] arrId)
        {
            JArray arrEquip = new JArray();

            foreach (var id in arrId)
            {
                Equipment equipment = db.Equipments.Find(id);

                JObject obEquip = new JObject();
                obEquip.Add("Name", equipment.Name);
                obEquip.Add("FormalName", equipment.FormalName);
                obEquip.Add("Group", equipment.Group);
                arrEquip.Add(obEquip);

                db.Equipments.Remove(equipment);
            }

            Log log = new Log
            {
                ActionType = "Delete",
                DataType = "P.Equipment",
                Date = DateTime.Now,
                User = User.Identity.Name,
                ChangeData = arrEquip.ToString()
            };

            db.Add(log);
            db.SaveChanges();
        }

        // Edit
        public void Edit(int id, string group, string name, string formalName, string desc)
        {
            JArray arrEquip = new JArray();

            Equipment equipment = db.Equipments.Find(id);
            bool change = false;

            if (equipment.Group != (string.IsNullOrEmpty(group) ? null : group.Trim()))
            {
                JObject obj = new JObject();
                obj.Add("Type", "Group");
                obj.Add("oValue", equipment.Group);
                obj.Add("nValue", group);
                arrEquip.Add(obj);

                equipment.Group = group;
                change = true;
            }

            if (equipment.Name != (string.IsNullOrEmpty(name) ? null : name.Trim()))
            {
                JObject obj = new JObject();
                obj.Add("Type", "Name");
                obj.Add("oValue", equipment.Name);
                obj.Add("nValue", name);
                arrEquip.Add(obj);

                equipment.Name = name;
                change = true;
            }

            if (equipment.FormalName != (string.IsNullOrEmpty(formalName) ? null : formalName.Trim()))
            {
                JObject obj = new JObject();
                obj.Add("Type", "FormalName");
                obj.Add("oValue", equipment.FormalName);
                obj.Add("nValue", formalName);
                arrEquip.Add(obj);

                equipment.FormalName = formalName;
                change = true;
            }

            if (equipment.Desc != (string.IsNullOrEmpty(desc) ? null : desc.Trim()))
            {
                JObject obj = new JObject();
                obj.Add("Type", "Desc");
                obj.Add("oValue", equipment.Desc);
                obj.Add("nValue", desc);
                arrEquip.Add(obj);

                equipment.Desc = desc;
                change = true;
            }

            if (change)
            {
                Log log = new Log
                {
                    ActionType = "P.Equipment",
                    RefId = equipment.Id,
                    Date = DateTime.Now,
                    User = User.Identity.Name,
                    ChangeData = arrEquip.ToString()
                };

                db.Add(log);
                db.Entry(equipment).State = EntityState.Modified;
                db.SaveChanges();
            }
        }

        // item 불러오기
        public JObject LoadItem(int id)
        {
            var dbItem = db.Equipments.Find(id);

            JObject objItem = new JObject();
            objItem.Add("id", dbItem.Id);
            objItem.Add("group", dbItem.Group);
            objItem.Add("name", dbItem.Name);
            objItem.Add("formalname", dbItem.FormalName);
            objItem.Add("desc", dbItem.Desc);

            return objItem;
        }

        //// GET: Equipments
        //public async Task<IActionResult> Index()
        //{
        //    return View(await _context.Equipment1.ToListAsync());
        //}

        //// GET: Equipments/Details/5
        //public async Task<IActionResult> Details(int? id)
        //{
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }

        //    var equipment = await _context.Equipment1
        //        .FirstOrDefaultAsync(m => m.Id == id);
        //    if (equipment == null)
        //    {
        //        return NotFound();
        //    }

        //    return View(equipment);
        //}

        //// GET: Equipments/Create
        //public IActionResult Create()
        //{
        //    return View();
        //}

        //// POST: Equipments/Create
        //// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        //// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Create([Bind("Id,Name,Desc,FormalName,Group,Date,User")] Equipment equipment)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        _context.Add(equipment);
        //        await _context.SaveChangesAsync();
        //        return RedirectToAction(nameof(Index));
        //    }
        //    return View(equipment);
        //}

        //// GET: Equipments/Edit/5
        //public async Task<IActionResult> Edit(int? id)
        //{
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }

        //    var equipment = await _context.Equipment1.FindAsync(id);
        //    if (equipment == null)
        //    {
        //        return NotFound();
        //    }
        //    return View(equipment);
        //}

        //// POST: Equipments/Edit/5
        //// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        //// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Desc,FormalName,Group,Date,User")] Equipment equipment)
        //{
        //    if (id != equipment.Id)
        //    {
        //        return NotFound();
        //    }

        //    if (ModelState.IsValid)
        //    {
        //        try
        //        {
        //            _context.Update(equipment);
        //            await _context.SaveChangesAsync();
        //        }
        //        catch (DbUpdateConcurrencyException)
        //        {
        //            if (!EquipmentExists(equipment.Id))
        //            {
        //                return NotFound();
        //            }
        //            else
        //            {
        //                throw;
        //            }
        //        }
        //        return RedirectToAction(nameof(Index));
        //    }
        //    return View(equipment);
        //}

        //// GET: Equipments/Delete/5
        //public async Task<IActionResult> Delete(int? id)
        //{
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }

        //    var equipment = await _context.Equipment1
        //        .FirstOrDefaultAsync(m => m.Id == id);
        //    if (equipment == null)
        //    {
        //        return NotFound();
        //    }

        //    return View(equipment);
        //}

        //// POST: Equipments/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> DeleteConfirmed(int id)
        //{
        //    var equipment = await _context.Equipment1.FindAsync(id);
        //    _context.Equipment1.Remove(equipment);
        //    await _context.SaveChangesAsync();
        //    return RedirectToAction(nameof(Index));
        //}

        //private bool EquipmentExists(int id)
        //{
        //    return _context.Equipment1.Any(e => e.Id == id);
        //}
    }
}
