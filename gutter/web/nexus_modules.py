"""
gutter.nexus_modules
~~~~~~~~~~~~~~~~~~~~~~

:copyright: (c) 2010 DISQUS.
:license: Apache License 2.0, see LICENSE for more details.
"""

from __future__ import absolute_import

import nexus
import os

from gutter.client.default import gutter as manager
from gutter.web.forms import SwitchForm, ConditionFormSet
from django.template import RequestContext
# from django.http import HttpResponse, HttpResponseNotFound


def operator_info(operator):
    return dict(
        path=operator,
        label=operator.label,
        preposition=operator.preposition,
        arguments=operator.arguments,
        group=operator.group
    )


def argument_info(argument_container):
    return dict(
        string=argument_container.__name__,
        arguments=argument_container.arguments
    )


class GutterModule(nexus.NexusModule):
    home_url = 'index'
    name = 'gutter'
    media_root = os.path.normpath(os.path.join(os.path.dirname(__file__), 'media'))

    def get_title(self):
        return 'Gutter'

    def get_urls(self):
        from django.conf.urls.defaults import patterns, url

        urlpatterns = patterns('',
            url(r'^add/$', self.as_view(self.add), name='add'),
            url(r'^update/(\w+)$', self.as_view(self.update), name='update'),
            url(r'^delete/$', self.as_view(self.delete), name='delete'),
            url(r'^$', self.as_view(self.index), name='index'),
        )

        return urlpatterns

    def render_on_dashboard(self, request):
        return 'switches'

    @property
    def __index_context(self):
        return {
            "manager": manager,
            "sorted_by": 'date_created',
            "switches": map(SwitchForm.from_object, manager.switches)
        }

    def index(self, request):
        return self.render_to_response(
            "gutter/index.html",
            RequestContext(request, self.__index_context),
            request
        )

    def add(self, request):
        pass

    def update(self, request, switch_name):
        switch = SwitchForm(request.POST)
        switch.conditions = ConditionFormSet(request.POST)

        context = RequestContext(request, self.__index_context)

        return self.render_to_response(
            "gutter/index.html",
            context,
            request
        )

    def status(self, request):
        pass

    def delete(self, request):
        pass

    def add_condition(self, request):
        pass

    def remove_condition(self, request):
        pass

nexus.site.register(GutterModule, 'gutter')