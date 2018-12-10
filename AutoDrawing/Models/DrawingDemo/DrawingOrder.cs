using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("DrawingOrder", Schema = "Drawing")]
    public partial class DrawingOrder
    {
        public DrawingOrder()
        {
            DrawingEquipments = new HashSet<DrawingEquipment>();
            FileList = new HashSet<FileList>();
        }

        public int Id { get; set; }
        public string DwgInfoFile { get; set; }
        public int? ServiceIdx { get; set; }
        public string DwgInfoSaveName { get; set; }
        public string Path { get; set; }

        //public DrawingOrder IdNavigation { get; set; }
        //public DrawingOrder InverseIdNavigation { get; set; }
        public ICollection<DrawingEquipment> DrawingEquipments { get; set; }
        public ICollection<FileList> FileList { get; set; }
    }
}
