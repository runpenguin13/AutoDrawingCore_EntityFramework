using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoDrawing.Models.DrawingDemo
{
    public class DiagramInterface
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Value { get; set; }
        public string Layer { get; set; }
    }

    public class DiagramComponent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Value { get; set; }
        public string Layer { get; set; }
    }

    public class DiagramNotation
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Value { get; set; }
        public string Layer { get; set; }
    }


    public class DiagramConfigContainer
    {
        public virtual ICollection<DiagramInterface> DiagramInterfaces { get; set; }
        public virtual ICollection<DiagramComponent> DiagramComponent { get; set; }
        public virtual ICollection<DiagramInterface> DiagramNotation { get; set; }

    }

    public class DiagramEntityBase
    {
        public int id { get; set; }
        public string group { get; set; }
        public string title { get; set; }
        public string value { get; set; }
        public string layer { get; set; }
    }
    public class DiagramEntity : DiagramEntityBase
    {
        public ICollection<DiagramEntityBase> notations { get; set; }
    }

    public class ShipObject
    {
        public int id { get; set; }
        public string HullName { get; set; }
        public string ShipName { get; set; }
    }

    public class EquipmentObject
    {
        public int id { get; set; }
        public string name { get; set; }
        public string model { get; set; }
    }

    public class DrawingObject
    {
        public int id { get; set; }
        public string version { get; set; }
        public string title { get; set; }
        public string phase { get; set; }
    }
    public class VisioObject
    {
        public int id { get; set; }
        public string name { get; set; }
        public string file { get; set; }
    }

    public class DiagramObject
    {
        public ShipObject ship { get; set; }
        public EquipmentObject equipment { get; set; }
        public DrawingObject drawing { get; set; }
        public VisioObject visio { get; set; }
        public List<DiagramEntity> properties { get; set; }
        public List<DiagramEntity> interfaces { get; set; }
        public List<DiagramEntity> components { get; set; }
        public List<DiagramEntity> notations { get; set; }
    }
}
