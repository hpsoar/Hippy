/*!
 * iOS SDK
 *
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2019 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#import "NativeRenderManager.h"

void NativeRenderManager::CreateRenderNode(std::vector<std::shared_ptr<DomNode>> &&nodes) {
    for (const std::shared_ptr<DomNode> &node : nodes) {
        int32_t tag = node->GetId();
        const std::string &viewName = node->GetViewName();
        int32_t rootTag = node->GetRenderInfo().pid;
        [uiManager renderCreateView:tag viewName:viewName rootTag:rootTag tagName:node->GetTagName() props:node->GetStyleMap()];
    }
}

void NativeRenderManager::UpdateRenderNode(std::vector<std::shared_ptr<DomNode>>&& nodes) {
    for (const std::shared_ptr<DomNode> &node : nodes) {
        int32_t tag = node->GetId();
        const std::string &viewName = node->GetViewName();
        [uiManager renderUpdateView:tag viewName:viewName props:node->GetStyleMap()];
    }
}

void NativeRenderManager::DeleteRenderNode(std::vector<std::shared_ptr<DomNode>>&& nodes) {
    std::vector<int32_t> indices;
    int32_t rootTag = INT32_MIN;
    for (const std::shared_ptr<DomNode> &node : nodes) {
        DomNode::RenderInfo info = node->GetRenderInfo();
        if (INT32_MIN == rootTag) {
            rootTag = info.pid;
        }
        else {
            HippyAssert(rootTag == info.pid, @"DeleteRenderNode ,nodes not on the same parent node");
        }
        indices.push_back(info.index);
    }
    if (INT32_MIN != rootTag) {
        [uiManager renderDeleteViewFromContainer:rootTag forIndices:indices];
    }
}

void NativeRenderManager::MoveRenderNode(std::vector<int32_t>&& ids,
                                      int32_t pid,
                                      int32_t id) {
    [uiManager renderMoveViews:ids fromContainer:pid toContainer:id];
}

void NativeRenderManager::Batch() {
    [uiManager batch];
}

void NativeRenderManager::CallFunction(std::weak_ptr<DomNode> domNode, const std::string &name,
                                    std::unordered_map<std::string, std::shared_ptr<DomValue>> param,
                                    DispatchFunctionCallback cb) {
    std::shared_ptr<DomNode> node = domNode.lock();
    if (node) {
        [uiManager dispatchFunction:name forView:node->GetId() params:param callback:cb];
    }
}

void NativeRenderManager::SetClickEventListener(int32_t id, OnClickEventListener listener) {
    [uiManager addClickEventListener:listener forView:id];
}

void NativeRenderManager::RemoveClickEventListener(int32_t id) {
    [uiManager removeClickEventForView:id];
}

void NativeRenderManager::SetLongClickEventListener(int32_t id, OnLongClickEventListener listener) {
    [uiManager addLongClickEventListener:listener forView:id];
}

void NativeRenderManager::RemoveLongClickEventListener(int32_t id) {
    [uiManager removeLongClickEventForView:id];
}

void NativeRenderManager::SetTouchEventListener(int32_t id, TouchEvent event, OnTouchEventListener listener) {
    [uiManager addTouchEventListener:listener touchEvent:event forView:id];
}

void NativeRenderManager::RemoveTouchEventListener(int32_t id, TouchEvent event) {
    [uiManager removeTouchEvent:event forView:id];
}

void NativeRenderManager::SetShowEventListener(int32_t id, ShowEvent event, OnShowEventListener listener) {
    [uiManager addShowEventListener:listener showEvent:event forView:id];
}

void NativeRenderManager::RemoveShowEventListener(int32_t id, ShowEvent event) {
    [uiManager removeShowEvent:event forView:id];
}