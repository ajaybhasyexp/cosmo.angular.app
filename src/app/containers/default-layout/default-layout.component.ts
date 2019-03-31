import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(private route: Router, private auth: AuthService, @Inject(DOCUMENT) _document?: any) {
    this.changes = new MutationObserver(mutations => {
      this.sidebarMinimized = _document.body.classList.contains(
        'sidebar-minimized'
      );
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnInit() {
    if (!this.auth.isSuperAdmin()) {
      this.navItems = navItems.filter(nav => nav.userRole !== 'superuser');
    }
  }

  logout(): void {
    localStorage.clear();
    this.route.navigate(['masters']);
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
