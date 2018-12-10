using System;
using System.Collections.Generic;

namespace AutoDrawing.Models.DrawingDemo
{
    public partial class AspNetRoles
    {
        public AspNetRoles()
        {
            AspNetUserRoles = new HashSet<AspNetUserRoles>();
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string Discriminator { get; set; }

        public AspNetRoles IdNavigation { get; set; }
        public AspNetRoles InverseIdNavigation { get; set; }
        public ICollection<AspNetUserRoles> AspNetUserRoles { get; set; }
    }
}
